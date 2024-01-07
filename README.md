<h1>Sistema Monolítico: Sugestão de Design de Código</h1>

O projeto é uma sugestão de design de um sistema monolítico, projetado com módulos totalmente desacoplados.

<h2>Por quê?</h2>

Sistemas monolíticos são muitas vezes vistos como vilões no desenvolvimento, mas a verdade é que essa arquitetura pode ser a ideal em muitos casos: No início de um projeto onde ainda não se conhece muito sobre, em casos onde o sistema não tem perspectivas de crescimento de usuários, entre outros. A arquitetura de microserviços pode ser extremamente desafiadora e cara, tornando-se a construção do monolito a opção mais sensata.
Contudo, construir um monolito também traz grandes desafios, principalmente quanto à organização da base de código. Dito isto, é fundamental projetar e organizar de forma a facilitar o desenvolvimento e manter o código sempre apto à mudanças.

O design contruído visa:

- Permitir que os módulos sejam totalmente desacoplados: Pro exemplo, caso o volume de acesso ao módulo de "store-catolog" aumente muito, é possível separá-lo e colocá-lo de forma externa, o que permitiria escalar apenas a parte necessária, sem muitas complicações, pois a comunicação se dá apenas pela <i>facades</i>, e não por <i>imports</i> à outros módulos.
- Permitir com que cada módulos tenha acesso apenas ao necessário: Pode haver mais de uma classe que remete à mesmo entidade, no entanto cada classe tem apenas as informações das quais o módulo onde está definada necessita.

<h2>Instalando Dependências</h2>
<code>npm install</code>

<h2>Executando Testes</h2>
<code>npm test</code>
