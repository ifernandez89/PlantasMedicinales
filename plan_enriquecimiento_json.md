Contenido:

Campos recomendados
1. Identidad y búsqueda
id
otrosNombres
tags
2. Terapéutica y uso
partesUsadas
preparaciones
principiosActivos
3. Evidencia y confianza
evidencia
scoreEvidencia
nivelRiesgo
gradoConsenso
4. Seguridad
seguridad
contraindicaciones
interacciones
5. Contexto regional y cultural
region
ecosistemas
conocimientoTradicional
6. Alimentación y uso complementario
usoAlimenticio
partesComestibles
valorNutricional
7. Citas y trazabilidad
referencias
Ejemplo de enriquecimiento
Plan de implementación
Fase 1: modelo y parser
Extender los tipos en el parser de plantas.
Adaptar la lectura de frontmatter para mapear los nuevos campos.
Mantener compatibilidad con las plantas actuales.
Fase 2: datos iniciales
Enriquecer unas pocas plantas piloto.
Usar los campos disponibles en los markdown actuales como base.
Completar solo lo que sea verificable o suficientemente claro.
Fase 3: UI y experiencia
Agregar una sección en la vista de detalle con:
Preparaciones y partes usadas
Evidencia y seguridad
Región y tradición
Referencias y tags
Mantener las acciones terapéuticas como bloque principal.
Fase 4: RAG y búsqueda
Permitir búsquedas por preparaciones, principios activos, regiones y tipos de evidencia.
Mejorar respuestas del asistente con contexto de seguridad y calidad de evidencia.
UX propuesta para la vista de detalle
Bloque principal: acciones terapéuticas, sistemas y afecciones.
Bloque complementario: partes usadas, preparaciones y principios activos.
Bloque de seguridad: contraindicaciones, interacciones y advertencias.
Bloque de confianza: evidencia, score, nivel de riesgo y grado de consenso.
Bloque contextual: región, ecosistemas, conocimiento tradicional y referencias.
Criterios de aceptación
El sistema sigue mostrando correctamente las acciones terapéuticas.
Las nuevas propiedades son leídas desde frontmatter sin romper la app.
La vista de detalle muestra la información nueva de forma clara y no saturada.
El RAG puede responder con mayor profundidad sobre seguridad, evidencia y contexto cultural.