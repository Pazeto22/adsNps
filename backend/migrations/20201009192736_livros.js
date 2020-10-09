exports.up = function (knex, Promise) {
  return knex.schema.createTable("livros", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.string("descricao").notNullable();
    table.string("imagemUrl");
    table.binary("conteudo").notNullable();
    table.integer("usuarioId").references("id").inTable("users");
    table.integer("generoId").references("id").inTable("generos");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("livros");
};
