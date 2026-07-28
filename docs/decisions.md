01.- empezamos el proyecto primero en react pero migramos a next para aprender a usarlo bien y tener proyectos con next en el portafolio.

02.- no usamos gtp como IA principal (como siempre), si no que aprovechamos 3 meses gratis de gemini Google, para testearla.

03.- creamos la primera seccion del home junto con todos los ajustes basicos. Resultado: Satisfactorio.

04.- creamos la segunda seccion y despues de varios fallo decidimos cambiarla, remplazando completamente el enfoque de diseño original (una ciudad vertical), por uno nuevo (cielo nocturno, estrellas, luna, constelaciones, etc...)

05.- hacemos la primera subida a github para tener respaldo de la antigua seccion 2 y el antiguo diseño.

06.- decidimos hacer la segunda seccion como una mini constelacion con una transicion cuando se hace click en alguna para mostrar su descripcion.

07.- primero intentamos hacerla con frameMotion, pero el resultado no era para nada el esperado por lo que terminamos haciendolo con CSS puro. Resultado: Satisfactorio.

08.- Se ajustan las animaciones en movile y desktop de la seccion 2 por temas de rendimiento. En caso de saturacion en el futuro, se puede reducir un poco mas.

09.- se agrega un cielo estrellado que cubre todo el body, se creo una clase global y luego se declara en cada Main. Resultado: Satisfactorio.

10.- se abandona gemini al poco tiempo de uso, porque considero que gpt es mucho mejor para codigo.

11.- se empieza la primera version de la seccion 3, que es para mostrar 4 proyectos destacados.

12.- se consiera airtable y supabase como bases de datos, pero nos decidimos por supabase, mas que nada por aprendizaje y por ser una base de datos real. Esta se usara tanto para hacer GET (proyectos destacados y proyectos en general) y los POST (formulario).

13.- se conecta el proyecto de next con supabase. Resultado: Satisfactorio.

14.- se crea el diseño base de la seccion 3 basados en grid. Resultado: Satisfactorio.

15.- para la version movile, se propone hacer un stack de las cards con sticky, primero se intenta con un sticky por card, pero luego de varios intentos fallidos se opta por crear un contenedor y a este darle sticky, lo que nos "obliga" a tener 2 componentes en la seccion 3, pero un con display none para ocultarlo convenientemente.

16.- DEUDA TECNICA: podria hacer un 3 componente que tipo useMediaQuery maneje que elemento de muestra y cuando, pero dado que son solo 4 cards, opto por dejar el display none.

17.- finalmente terminamos el stack para movile, pero debo admitir que no quede 100% satisfecho con el resultado, siento que la seccion 1 y 2 son mucho mejores con respecto a diseño, no me quejo del grid en si, sino en lo respecta quizas a hovers y sombras, ademas el efecto stack tampoco me convence al 100% aunque funciona relativamente bien. Resultado: Suficiente.

18.- empezamos la seccion 4, CV
