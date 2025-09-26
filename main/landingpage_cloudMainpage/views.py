from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import FileForm
from .models import File

@login_required
def dashboard(request):
    if request.method == 'POST':
        form = FileForm(request.POST)
        if form.is_valid():
            file = form.save(commit=False)
            file.owner = request.user
            file.save()
            return redirect('dashboard')
    else:
        form = FileForm()
    files = File.objects.filter(owner=request.user)
    return render(request, 'landingpage_cloudMainpage/dashboard.html', {'form': form, 'files': files})
