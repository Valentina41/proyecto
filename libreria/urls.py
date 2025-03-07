from django.urls import path, include  # Asegúrate de incluir "include"
from . import views
from django.conf import settings
from django.contrib.staticfiles.urls import static
from rest_framework.routers import DefaultRouter
from .views import LibroViewSet

router = DefaultRouter()
router.register(r'libros', LibroViewSet, basename='libro')

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('nosotros', views.nosotros, name='nosotros'),
    path('libros', views.libros, name='libros'),
    path('libros/crear', views.crear, name='crear'),
    path("libros/editar/<int:id>/", views.editar, name="editar"),

    path('libros/eliminar/<int:id>/', views.eliminar, name='eliminar'),

    path('api/', include(router.urls)),  # Incluido router para la API
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
