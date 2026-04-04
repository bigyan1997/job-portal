import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from accounts.models import User
from .models import Conversation, Message


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Authenticate user from token
        token = self.scope.get('query_string', b'').decode()
        if token.startswith('token='):
            token = token[6:]

        try:
            access_token = AccessToken(token)
            self.user = await self.get_user(access_token['user_id'])
        except Exception:
            await self.close()
            return

        # Check user is participant
        is_participant = await self.check_participant(self.conversation_id, self.user)
        if not is_participant:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get('content', '').strip()

        if not content:
            return

        message = await self.save_message(self.conversation_id, self.user, content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': message.id,
                    'content': message.content,
                    'sender_id': self.user.id,
                    'sender_name': self.user.full_name or self.user.email,
                    'created_at': message.created_at.isoformat(),
                    'is_read': message.is_read,
                }
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

    @database_sync_to_async
    def check_participant(self, conversation_id, user):
        try:
            conv = Conversation.objects.get(id=conversation_id)
            return conv.participants.filter(id=user.id).exists()
        except Conversation.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, conversation_id, sender, content):
        conv = Conversation.objects.get(id=conversation_id)
        conv.save()  # update updated_at
        return Message.objects.create(
            conversation=conv,
            sender=sender,
            content=content,
        )