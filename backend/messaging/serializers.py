from rest_framework import serializers
from .models import Conversation, Message
from accounts.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'is_read', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    other_participant = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'other_participant', 'last_message', 'unread_count', 'job_title', 'updated_at']

    def get_other_participant(self, obj):
        user = self.context['request'].user
        other = obj.get_other_participant(user)
        return UserSerializer(other).data if other else None

    def get_last_message(self, obj):
        msg = obj.last_message()
        return MessageSerializer(msg).data if msg else None

    def get_unread_count(self, obj):
        return obj.unread_count(self.context['request'].user)

    def get_job_title(self, obj):
        return obj.job.title if obj.job else None