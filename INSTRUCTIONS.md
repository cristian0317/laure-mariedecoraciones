
# Guía de Usuario del Panel de Administración del Portfolio

¡Bienvenido! Esta guía te ayudará a gestionar los proyectos de tu portfolio de forma sencilla.

## Índice

1.  [Acceso al Panel de Administración](#acceso-al-panel-de-administración)
2.  [Gestión de Proyectos](#gestión-de-proyectos)
    *   [Añadir un Nuevo Proyecto](#añadir-un-nuevo-proyecto)
    *   [Editar un Proyecto Existente](#editar-un-proyecto-existente)
    *   [Eliminar un Proyecto](#eliminar-un-proyecto)
3.  [Gestión de Categorías](#gestión-de-categorías)
    *   [Añadir una Nueva Categoría](#añadir-una-nueva-categoría)

---

## Acceso al Panel de Administración

Para empezar a gestionar tu portfolio, primero debes iniciar sesión.

1.  Abre tu navegador y ve a la página de administración (normalmente será `https://tudominio.com/admin`).
2.  Verás un formulario de inicio de sesión. Introduce tu correo electrónico y contraseña.

    > **Nota**: Las credenciales de acceso se configuran mediante las variables de entorno `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Asegúrate de que estas variables estén definidas correctamente en tu entorno de despliegue o en el archivo `.env.local` si estás en desarrollo.

3.  Haz clic en el botón "Login".

    `[IMAGEN AQUÍ: Captura de pantalla del formulario de inicio de sesión]`

Si las credenciales son correctas, serás redirigido al panel principal de administración.

---

## Gestión de Proyectos

En el panel principal, verás una lista de todos tus proyectos actuales. Desde aquí puedes añadir, editar y eliminar proyectos.

`[IMAGEN AQUÍ: Captura de pantalla del listado de proyectos en el panel de administración]`

### Añadir un Nuevo Proyecto

1.  Para agregar un nuevo proyecto, haz clic en el botón **"Agregar Proyecto"** en la esquina superior derecha.
2.  Se abrirá un formulario donde deberás rellenar los siguientes campos:
    *   **Título**: El nombre del proyecto.
    *   **Descripción**: Un texto detallado sobre el proyecto.
    *   **URL**: El enlace al proyecto en vivo (si lo tiene).
    *   **Repositorio**: El enlace al repositorio de código (ej. GitHub).
    *   **Imagen**: Sube una imagen representativa del proyecto.
    *   **Categoría**: Selecciona la categoría a la que pertenece el proyecto.
3.  Una vez completados los campos, haz clic en **"Guardar"**.

    `[IMAGEN AQUÍ: Captura de pantalla del formulario para añadir un nuevo proyecto]`

El nuevo proyecto aparecerá ahora en tu portfolio.

### Editar un Proyecto Existente

1.  En la lista de proyectos, busca el que quieres modificar.
2.  Haz clic en el botón **"Editar"** (normalmente un icono de lápiz) junto al proyecto.
3.  Se abrirá el mismo formulario que al añadir un proyecto, pero con la información ya cargada.
4.  Realiza los cambios que necesites y haz clic en **"Guardar"**.

    `[IMAGEN AQUÍ: Captura de pantalla del formulario de edición con datos de un proyecto]`

Los cambios se aplicarán inmediatamente.

### Eliminar un Proyecto

1.  En la lista de proyectos, encuentra el que deseas eliminar.
2.  Haz clic en el botón **"Eliminar"** (normalmente un icono de papelera) junto al proyecto.
3.  Aparecerá una ventana de confirmación para evitar borrados accidentales. Haz clic en **"Eliminar"** para confirmar.

    `[IMAGEN AQUÍ: Captura de pantalla de la confirmación de eliminación]`

> **¡Atención!** Esta acción no se puede deshacer. Una vez eliminado, el proyecto desaparecerá permanentemente.

---

## Gestión de Categorías

Las categorías te permiten organizar tus proyectos (por ejemplo, "Desarrollo Web", "Diseño Gráfico", "Apps Móviles").

Para gestionar las categorías:

1.  En el menú lateral del panel de administración, haz clic en **"Categorías"**.
2.  Verás una lista de las categorías existentes.

    `[IMAGEN AQUÍ: Captura de pantalla de la sección de gestión de categorías]`

### Añadir una Nueva Categoría

1.  En la página de categorías, encontrarás un campo para escribir el nombre de la nueva categoría.
2.  Escribe el nombre (por ejemplo, "Marketing Digital").
3.  Haz clic en el botón **"Agregar Categoría"**.

    `[IMAGEN AQUÍ: Captura de pantalla de la adición de una categoría]`

La nueva categoría se añadirá a la lista y podrás asignarla a tus proyectos al crearlos o editarlos.

### Eliminar una Categoría

1.  En la lista de categorías, busca la que deseas eliminar.
2.  Haz clic en el botón **"Eliminar"** (normalmente un icono de papelera) junto a la categoría.
3.  Aparecerá una ventana de confirmación para evitar borrados accidentales. Haz clic en **"Eliminar"** para confirmar.

    `[IMAGEN AQUÍ: Captura de pantalla de la confirmación de eliminación de categoría]`

> **¡Atención!** Esta acción no se puede deshacer. Una vez eliminada, la categoría desaparecerá permanentemente.

