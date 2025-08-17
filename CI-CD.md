# 🚀 CI Pipeline - Sonora

Este repositorio utiliza GitHub Actions para implementar un pipeline de Integración Continua (CI).

## 🔄 Flujo de Trabajo

### 1. **Pull Request (PR)**
- ✅ Se ejecutan automáticamente los tests
- ✅ Se verifica el linting del código
- ✅ Se construye el proyecto
- ✅ Se comenta el estado en el PR
- ❌ **NO se hace deploy**

### 2. **Push a `main`**
- ✅ Se ejecutan todos los tests
- ✅ Se verifica el linting
- ✅ Se construye el proyecto
- ✅ **Vercel hace deploy automático** (configurado externamente)

## 📋 Workflows

### `.github/workflows/ci.yml`
- **Trigger:** Push a `main` o `develop`, Pull Requests
- **Objetivo:** Verificar que el código es válido
- **Acciones:**
  - Linting del código
  - Ejecución de tests
  - Build del proyecto
  - Comentario automático en PRs

### `.github/workflows/pr-check.yml`
- **Trigger:** Pull Requests a `main` o `develop`
- **Objetivo:** Verificación adicional para PRs
- **Acciones:**
  - Tests y build
  - Comentario detallado del estado

## 🛡️ Protección de Rama

La rama `main` está protegida y requiere:

1. **Pull Request obligatorio** antes del merge
2. **Tests exitosos** antes del merge
3. **Build exitoso** antes del merge
4. **Revisión de código** antes del merge
5. **Rama actualizada** antes del merge

## 🚀 Deploy Automático

**Vercel está configurado externamente** para hacer deploy automático cuando:
- Se hace push a la rama `main`
- Los tests pasan exitosamente
- El build es exitoso

No se requieren secrets adicionales en GitHub Actions para el deploy.

## 📝 Comandos Locales

### Ejecutar tests:
```bash
npm test
```

### Ejecutar linting:
```bash
npm run lint
```

### Build local:
```bash
npm run build
```

### Ejecutar todo el pipeline localmente:
```bash
npm run lint && npm test && npm run build
```

## 🚨 Troubleshooting

### Tests fallando:
1. Ejecuta `npm test` localmente
2. Revisa los logs de error
3. Corrige los problemas
4. Haz commit y push

### Build fallando:
1. Ejecuta `npm run build` localmente
2. Revisa los errores de TypeScript/compilación
3. Corrige los problemas
4. Haz commit y push

### Deploy fallando:
1. Verifica que Vercel esté configurado correctamente
2. Revisa los logs de Vercel
3. Verifica que el proyecto esté configurado en Vercel

## 🔗 Enlaces Útiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
