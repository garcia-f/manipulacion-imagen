async function cargarImagen(url) {
    const imagen = new Image();
    imagen.crossOrigin = 'Anonymous';
    imagen.src = url;
    await new Promise((resolve) => {
        imagen.onload = resolve;
    });
    return imagen;
}

async function principal() {
    const inputImagen = document.getElementById('inputImagen');
    const imagenOriginal = document.getElementById('imagenOriginal');
    inputImagen.addEventListener('change', async function(evento) {
        const archivo = evento.target.files[0];
        const urlImagen = URL.createObjectURL(archivo);
        imagenOriginal.src = urlImagen;

        const imagen = await cargarImagen(urlImagen);
        const tensor = tf.browser.fromPixels(imagen).toFloat().div(tf.scalar(255));

        // Función 1: Redimensionar usando el vecino más cercano
        const imagenRedimensionada1 = tf.image.resizeNearestNeighbor(tensor, [150, 150]);
        const lienzoRedimensionado1 = document.getElementById('lienzoRedimensionado1');
        await tf.browser.toPixels(imagenRedimensionada1, lienzoRedimensionado1);

        // Función 2: Redimensionar usando bilinear
        const imagenRedimensionada2 = tf.image.resizeBilinear(tensor, [150, 150]);
        const lienzoRedimensionado2 = document.getElementById('lienzoRedimensionado2');
        await tf.browser.toPixels(imagenRedimensionada2, lienzoRedimensionado2);

        // Recortar la imagen
        const imagenRecortada = tensor.slice([0, 0, 0], [100, 100, 3]);
        const lienzoRecortado = document.getElementById('lienzoRecortado');
        await tf.browser.toPixels(imagenRecortada, lienzoRecortado);

        // Espejar la imagen horizontalmente (voltear)
        const imagenEspejada = tensor.reverse(1);
        const lienzoEspejado = document.getElementById('lienzoEspejado');
        await tf.browser.toPixels(imagenEspejada, lienzoEspejado);
    });
}

principal();