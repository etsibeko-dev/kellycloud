from django.shortcuts import render, redirect
from .forms import RegistrationForm

def get_started(request):
    return render(request, 'get_startedpage/get_started.html')

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = RegistrationForm()
    return render(request, 'get_startedpage/register.html', {'form': form})
