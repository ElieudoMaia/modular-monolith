<h1>Monolithic System: Code Design Suggestion</h1>

The project is a code design suggestion for a monolithic system, designed with fully decoupled modules.

<h2>Why?</h2>

Monolithic systems are often seen as villains in development, but the truth is that this architecture can be ideal in many cases: at the beginning of a project where not much is known, in cases where the system has no expectations of user growth, among others. The microservices architecture can be extremely challenging and expensive, making the construction of a monolith the most sensible option.
However, building a monolith also brings significant challenges, especially regarding the organization of the codebase. That said, it is essential to design and organize it in a way that facilitates development and keeps the code always ready for changes.

The designed architecture aims to:

- Allow modules to be fully decoupled: For example, if the access volume to the "store-catalog" module increases significantly, it is possible to separate it and place it externally, allowing scaling only the necessary part without much complication. This is because communication occurs only through <i>facades</i>, not through <i>imports</i> from other modules.
- Allow each module to have access only to what is necessary: There may be more than one class that refers to the same entity, but each class has only the information that the module where it is defined needs.

<h2>Installing Dependencies</h2>
<code>npm install</code>

<h2>Running Tests</h2>
<code>npm test</code>
