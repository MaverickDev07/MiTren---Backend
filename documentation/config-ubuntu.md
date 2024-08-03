# Guía de Configuración de Entorno de Desarrollo en Ubuntu 22.04

## Primeros Pasos

### Actualizar el Sistema Operativo

```bash
sudo apt update && sudo apt upgrade -y
```

Revisar y actualizar Sistema Operativo, version de Linux

```bash
lsb_release -a
```

Actualizar SO Linux

```bash
sudo do-release-upgrade -d
```

Resolución de problemas de dependencias

```bash
sudo apt-get check
sudo apt-get -f install
sudo apt-get install --reinstall build-essential
```

Eliminar paquetes

```bash
sudo apt remove package
sudo apt purge package
sudo apt autoclean
sudo apt search package
```

Instalar GIT y configurar SSH

```bash
sudo apt install git -y
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
cat ~/.ssh/id_rsa.pub
# Copiar la llave pública y agregarla a las configuraciones de GitHub
```

Crear un Nuevo Usuario

```bash
sudo adduser [gguzman]
sudo usermod -aG sudo [gguzman]
```

Cambiar a Nuevo Usuario

```bash
su - gguzman
sudo apt update && sudo apt upgrade -y
```

Instalar Fish Shell y Fisher

```bash
sudo apt install fish -y
chsh -s /usr/bin/fish
fish -v
curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher
fisher -v
source ~/.config/fish/config.fish
```

Instalar Tmux

```bash
sudo apt install tmux -y
```

Instalar Node Version Manager (NVM) y Node.js v20.16.0 LTS/Iron

```bash
fisher install jorgebucaran/nvm.fish
nvm install v20.16.0
nvm use v20.16.0
set --universal nvm_default_version v20.16.0 # Vesion para Instalar todo NVIM
```

Configurar Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

Configuración de Nginx como Proxy Reverso

```bash
sudo nano /etc/nginx/sites-available/default
```

Configurar el archivo

```bash
server {
    listen 80;

    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reiniciar Nginx

```bash
sudo systemctl restart nginx
```
