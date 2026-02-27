# Taller Espacios Proyectivos Matrices Proyeccion

Victor Saa y

## Fecha de entrega

`2026-02-27`

## Descripción

Este proyecto es una aplicación para evaluar perspectivas y proyecciones.

## Implementaciónes

### Python

Se utilizó jupyter notebook para la implementación. Se carga el objeto y se extrae la geometría, vertices y caras. Se utiliza matplotlib para la visualización.

```bash
# Crear el entorno virtual
python -m venv .venv

# Activar el entorno virtual
.venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### Jupyter en el editor (VS Code, Antigravity, etc.)

```bash
# Registrar el kernel para Jupyter
python -m ipykernel install --user --name semana2-1-visual --display-name "Python (semana2-1-visual)"
```

Abre `main.ipynb`, haz clic en el selector de kernel (arriba a la derecha) y elige **Python (semana2-1-visual)**.

### Three.js

Se utilizó three.js para la implementación. Se carga el objeto y se extrae la geometría, vertices y caras. Se utiliza three fiber para la visualización.

```bash
cd threejs

# Con yarn
yarn install
yarn dev

# Con npm
npm install
npm run dev
```

### Processing

Se utilizó processing para implementar la diferencia en la visualización entre el modo perspectiva y el modo ortográfico.

## IA

IDE, prompts y autocompletado: Antigravity

## Resultados visuales

![Python](media/NOMBRE.gif)
![Three.js](media/2-1-threejs.gif)
![Modo Perspectiva Processing](media/perspective_mode_processing.gif)
![Modo Ortográfico Processing](media/ortographic_mode_processing.gif)


## Prompts utilizados

Se usaron prompts para generar objetos en threejs.

## Aprendizajes

Aca se jugo con la implementacion de distintas perspectivas.
