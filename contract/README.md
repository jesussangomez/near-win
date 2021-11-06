NEAR Win! Smart Contract
==================

Un [smart contract] escrito en [AssemblyScript] para una aplicación creada con [create-near-app]


Como empezar
===========

Antes de compilar este código, necesitarás instalar [Node.js] ≥ 12


Exploring The Code
==================

1. El código principal del smart contract se encuentra en `assembly/index.ts`. Puedes compilarlo con el script `./compile`.
   * `addRace` es el contrato que se usa para agregar el resultado de una carrera, contiene el nombre de la cuenta logueada, el jugador que elegiste, el ganador de la carrera, y el resultado (ganaste o perdiste).
   * `getRaces` es el contrato que se usa para obtener todas las carreras (con un límite de las últimas 10 carreras).

2. Los tests de se encuentran en `test/index.ts`.


  [smart contract]: https://docs.near.org/docs/develop/contracts/overview
  [AssemblyScript]: https://www.assemblyscript.org/
  [create-near-app]: https://github.com/near/create-near-app
  [Node.js]: https://nodejs.org/en/download/package-manager/
