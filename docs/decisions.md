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

18.- empezamos la seccion 4, CV.

19.- se opta por un compoente ultra basico que abra el pdf del cv en otra pestaña. En base a esto surge la idea de crear el componente ButtonLink para utilizar de manera modular los links fuera del sitio web al igual que lo hacemos con ButtonNav, por lo que se modifico la seccion home3 para remplazar los antiguos "a" por el nuevo componente. cc

20.- Queda pendiente para el futuro hacer que el sitio detecte si el idioma es ingles o español ademas de ofrecer la vista del cv en ingles o español independiente del idioma.

21.- se empieza la seccion 5, Form.

22.- modificamos la tabla de supabase contact_messages remplazando subject por contact_type, ademas de ajustar los RLS mas bien liberarlos.

23.- creamos 5 componentes nuevos para manejar la conexion de supabase con next, hacemos los test correspondientes en powershell Invoke-restMethod y todo pasa las pruebas (Prueba válida, contactType inválido, Probar el honeypot).

24.- por ahora dejamos solo el honeypot como medida de seguridad, pero mas adelante implementaremos protecciones medias/altas contra bots, a modo de prolijidad tecnica, mas que porque crea que mircomania es un objetivo de bots.

25.- modularizamos los componentes para dividir responsabilidades, ademas de crear la logica de captura de UTM y en evento send_form para GTM (se agregan los campos correpondientes a supabase para guardar los 3 utm).

26.- se arma el diseño y estructura final de la seccion Home5, la cual sera replicada en diseño para Contacto1, mas no asi su contenido ademas del form.

27.- se testea por ultima vez ya con la seccion terminada y todo bien. Resultado: Satisfactorio.

28.- se empieza la construccion del navbar, ya con la estructura del sitio base completa. En esta primera version del sitio el navbar navegara a travez de anclas por la home, a excepcion de "contacto" que ira a /contacto.

29.- se migran unos componentes reutilizables que usaba en react a next, se reduce bastante el codigo por funciones nativas de next, terminando asi con un navbar reutilizable para next. Aunque durante la migracion se debieron corregir varios fallos pequeños.

30.- se crea la maqueta con diseño base del navbar en su version desktop y mobile.

31.- se crea un nuevo menu.svg, este con solo 2 rayas horizontales que al darle click se animan y se transforman en X.

32.- se mejora el diseño en general y se ajusta la distancia de las anclas de manera individual en navbar.css

33.- como ajuste de diseño final se decide que el navbar al ser FIX, al scrollear en la pantalla pasa de transparente a color, al principio solo deja asi, pero no convene al verse muy cuadrado, por lo que finalmente optamos por hacer una especie de modulo flotante que se ve bastante bien y le da un toque muy pro. Resultado: Satisfactorio.

34.- detectamos un problema en el diseño del menu navbar en mobil, porque lo que decidimos restructurar useBurgerMenu y BurgerMenu para corregir el diseño, se vuelven a hacer los test y pasan sin problema. Resultado: Satisfactorio.

34.- se comienza el desarrollo del footer.

35.- Se define rapidamente la estructura y el contenido, se crea una version base y luego se ajusta el diseño completo. Resultado: Satisfactorio.

35.- antes de empezar con Contacto y Politicas Page, preferi dejar listo de un vez todos los archivos de ruta y metadata listos, ademas de not-found page.

36.- yo pensaba agregar los mismos sitemap y robots que react, pero vi que react resuelve muchas cosas que react no de manera nativa, porque lo que implementamos sitemap.ts, robots.ts y not-found.tsx, ademas de usar Metadatos nativo de next para estos mismos en cada pagina, desechando asi y para siempre, TitleSEO.tsx (componente que usaba para la metadata en react)

37.- Con respecto a la Metadata: se implementa en el layauot una metadata general ademas de aplicar "template: '%s | Mircomania'" para asi en cada ruta solo completar titulos cortos (contacto = contacto | mircomania), excepto en la pagine de Home, que tiene su propio titulo "mircomania | ....." puesto asi con "absolute".

38.- Con respecto a Sitemap y Robots: se implementan versiones de estos mismos en .ts, componentes bastante siemples, la unica observacion considerable, es que en sitemap se dejan solo las url, sacando prioridad, tiempo de cambio y cada cuanto tiempo se cambia.

39.- Con respecto a not-found: se hace una pagina bastante simple, resiclando el fondo de estrellas de la home, que sera utilizado de igual manera en todo el sitio.

40.- DEUDA TECNICA: hacer estilos reutilizables para SmartLink

41.- Agregamos los opengraph y twitter cards al layaout, ademas creamos un helper para manejar la metadata pagina por pagina createMetada.ts

42.- Creamos un archivo constante que almacena todas las rutas del sitio routes.ts, asi manejamos las rutas desde un solo lugar. Sr actualiza todo el sitio

43.- Creamos y conectamos las rutas de contacto y politica-privacidad

44.- Ahora empezamos a crear politicas para luego armar contacto y preparanos para produccion.

45.- Primero creamos privacy, una pagina muy simple me incluye las politicas de privacidad, algo que rescato de aqui, me gusto el diseño del h1, por lo que lo replicaremos para las otras paginas como estilo de titulos definido.

46.- Ahora creamos la pagina de contact, que es a grandes razgos una copia de home5 home, solo se cambia el texto que complementa el form. Aprovechamos esta etapa para mover los archivos de particulePlanet a una nueva carpeta de visual, ya que ahora sera un componente reutilizable y no solo parte de la seccion 5 home.

47.- En este momento el sitio ya esta terminado al menos en lo que es estructura en su version 1.0, antes de pasar a produccion con esta primera version, quiero revisar algunos temas: ajuste de diseño para los titulos en general con el nuevo estilo predeterminado; investigar sobre un posible orden para la carpeta app, ya que parece una sopa de archivos y revisar un problema que me aparece en la terminal.

48.- solucionamos los temas de forma bastante sencilla, decubrimos que naxt de manera nativa acepta carpetas entre parentesis y no las colola en la ruta, con esto ordenamos la carpeta app un poco (site)

49.- el problema de la terminal "Detected `scroll-behavior: smooth` on the `<html>` element. To disable smooth scrolling during route transitions, add `data-scroll-behavior="smooth"` to your <html> element. Learn more: https://nextjs.org/docs/messages/missing-data-scroll-behavior" se debia que a no declaraba explicitamente "data-scroll-behavior="smooth" en el elemento html del layaout.

50.- finalmente no se ajutan mucho los titulos, se deja el estilo preterminado pensando para los h1 de cada pagina y los demas titulos quedan como estan, mas adelante en una revision completa de diseño dedicaremos mas tiempo a esto.

51.- se comienza a preparar la primera version para produccion.

52.- Antes de pasar a la primera version de produccion, decidimos agregar la columna "path" a la tabla de supabase, creamos un helper (getRequestPath) para almancenar los datos del path utilizando funciones nativas de next (PATH), y modificamos los componentes necesarios para configurar el envio del dato extra (types: CreateContactInput, createContact y route). se realizan test con resultado exitoso.
