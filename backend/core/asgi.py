import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Setup Django BEFORE importing anything else
django_asgi_app = get_asgi_application()

# Import routing AFTER Django is set up
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
import messaging.routing

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AllowedHostsOriginValidator(
        URLRouter(
            messaging.routing.websocket_urlpatterns
        )
    ),
})