### GoAPI Repository Documentation

#### Endpoints

##### User Endpoints
- **GET /user/**: Lista todos os usuários.
- **GET /user/{id}**: Obtém um usuário pelo ID.
- **POST /user/login**: Realiza login.
- **POST /user/register**: Realiza registro.
- **GET /user/logout**: Realiza logout.
- **GET /user/profile**: Obtém informações do usuário.

##### Stock Endpoints
- **GET /stock/{pharmacy}/{product}**: Obtém a quantidade disponível de um produto em uma farmácia.

##### Pharmacy Endpoints
- **GET /pharmacy/{id}**: Lista uma farmácia pelo ID.
- **GET /pharmacy/**: Lista todas as farmácias.
- **POST /pharmacy/create**: Cria uma farmácia.
- **GET /pharmacy/search/{name}**: Busca farmácias por nome.

##### Product Endpoints
- **POST /product/create**: Cria um produto.
- **GET /product/**: Lista todos os produtos.
- **DELETE /product/{id}**: Deleta um produto pelo ID.
- **POST /product/{id}**: Busca um produto pelo ID.
- **POST /product/name/{name}**: Busca um produto pelo nome.

##### Server Endpoints
- **GET /server**: Testa a conexão com o servidor.

#### Contributors
- [Polabiel](https://github.com/Polabiel) - 125 contributions

This documentation provides a comprehensive overview of the GoAPI repository, including its endpoints, languages used, and key contributors. For more details, visit the [GoAPI repository on GitHub](https://github.com/gohealthnow/GoAPI).
