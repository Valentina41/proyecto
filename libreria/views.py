from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from rest_framework import viewsets  
from .models import Libro
from .forms import LibroForm
from .serializers import LibroSerializer  
from rest_framework.permissions import AllowAny  

# Vistas tradicionales
def inicio(request):
    return render(request, 'paginas/inicio.html')

def nosotros(request):
    return render(request, 'paginas/nosotros.html')

def libros(request):
    libros = Libro.objects.all()
    return render(request, 'libros/index.html', {'libros': libros})

def crear(request):
    if request.method == "POST":
        formulario = LibroForm(request.POST, request.FILES)
        if formulario.is_valid():
            libro = formulario.save()
            return JsonResponse({
                "id": libro.id,
                "titulo": libro.titulo,
                "descripcion": libro.descripcion,
                "imagen": libro.imagen.url if libro.imagen else ""
            })  
    return JsonResponse({"error": "Datos inválidos"}, status=400)

def editar(request, id):
    libro = get_object_or_404(Libro, id=id)

    if request.method == "POST":
        formulario = LibroForm(request.POST, request.FILES, instance=libro)
        if formulario.is_valid():
            libro = formulario.save()
            return JsonResponse({
                "id": libro.id,
                "titulo": libro.titulo,
                "descripcion": libro.descripcion,
                "imagen": libro.imagen.url if libro.imagen else ""
            })

    return JsonResponse({"error": "Datos inválidos"}, status=400)

def eliminar(request, id):
    libro = get_object_or_404(Libro, id=id)
    libro.delete()
    return redirect('libros')

# API con DRF
class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()  
    serializer_class = LibroSerializer  
    permission_classes = [AllowAny]  
