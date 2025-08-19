# Configuración SEO para Sonora

> **🌐 Dominio configurado:** `https://sonora-rho.vercel.app`

## Archivos Creados

Se han creado los siguientes archivos para mejorar el SEO y la visibilidad en buscadores:

### 1. Metadata en `app/layout.tsx`

- Título y descripción optimizados
- Palabras clave relevantes
- Open Graph para redes sociales
- Twitter Cards
- Configuración de robots
- Metadatos para PWA

### 2. `public/robots.txt`

- Instrucciones para crawlers
- Referencia al sitemap

### 3. `public/sitemap.xml`

- Mapa del sitio para buscadores
- Frecuencia de actualización y prioridades

### 4. `public/manifest.json`

- Configuración PWA
- Metadatos para instalación en dispositivos

### 5. `public/browserconfig.xml`

- Configuración para Windows

## Pasos para Completar la Configuración

### 1. Verificación de Google Search Console

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Agrega tu dominio
3. Copia el código de verificación
4. Reemplaza `'your-google-verification-code'` en `app/layout.tsx`

### 2. Verificación de Yandex (opcional)

1. Ve a [Yandex Webmaster](https://webmaster.yandex.com/)
2. Agrega tu dominio
3. Copia el código de verificación
4. Reemplaza `'your-yandex-verification-code'` en `app/layout.tsx`

### 3. Verificación de Yahoo (opcional)

1. Ve a [Yahoo Site Explorer](https://siteexplorer.search.yahoo.com/)
2. Agrega tu dominio
3. Copia el código de verificación
4. Reemplaza `'your-yahoo-verification-code'` en `app/layout.tsx`

### 4. Crear Imágenes

Necesitarás crear las siguientes imágenes:

- `/og-image.png` (1200x630px) - Para Open Graph
- `/icon-192x192.png` (192x192px) - Icono PWA pequeño
- `/icon-512x512.png` (512x512px) - Icono PWA grande
- `/mstile-150x150.png` (150x150px) - Para Windows
- `/screenshot-wide.png` (1280x720px) - Captura de pantalla ancha
- `/screenshot-narrow.png` (750x1334px) - Captura de pantalla estrecha

### 5. URLs Configuradas

El dominio `https://sonora-rho.vercel.app` ya está configurado en:

- ✅ `app/layout.tsx`
- ✅ `public/robots.txt`
- ✅ `public/sitemap.xml`
- ✅ `public/manifest.json`

### 6. Configurar Analytics

Si usas Google Analytics, agrega el código de seguimiento en `app/layout.tsx`

## Beneficios de esta Configuración

1. **Mejor SEO**: Metadatos completos y optimizados
2. **Redes Sociales**: Open Graph y Twitter Cards para compartir
3. **PWA**: Experiencia de aplicación nativa
4. **Buscadores de IA**: Metadatos estructurados para mejor comprensión
5. **Indexación**: Sitemap y robots.txt para crawlers
6. **Móvil**: Configuración optimizada para dispositivos móviles

## Monitoreo

Después de implementar:

1. Verifica que tu sitio aparezca en Google Search Console
2. Prueba las tarjetas de Open Graph en [Facebook Debugger](https://developers.facebook.com/tools/debug/)
3. Prueba las Twitter Cards en [Twitter Card Validator](https://cards-dev.twitter.com/validator)
4. Monitorea el rendimiento en PageSpeed Insights
