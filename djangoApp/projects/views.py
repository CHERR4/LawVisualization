from django.core.files.storage import FileSystemStorage
from django.shortcuts import render
from .models import Law


def law_index(request):
    laws = Law.objects.all()
    context = {
        'laws': laws
    }
    return render(request, 'law_index.html', context)


def law_detail(request, pk):
    law = Law.objects.get(pk=pk)
    context = {
        'law': law
    }
    return render(request, 'law_detail.html', context)


def upload(request):
    context = {}
    if request.method == 'POST':
        uploaded_file = request.FILES['document']
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        context['url'] = fs.url(name)
    return render(request, 'upload.html', context)
