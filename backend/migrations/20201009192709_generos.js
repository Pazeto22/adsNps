exports.up = function (knex, Promise) {
  return knex.schema.createTable("generos", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.integer("relacaoId").references("id").inTable("generos");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("generos");
};
