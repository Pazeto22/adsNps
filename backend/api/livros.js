const queries = require("./queries");

module.exports = (app) => {
  const { existsOrError } = app.api.validation;

  const save = (req, res) => {
    const livro = { ...req.body };
    if (req.params.id) livro.id = req.params.id;

    try {
      existsOrError(livro.nome, "Informe o nome");
      existsOrError(livro.descricao, "Informe a descrição");
      existsOrError(livro.generoId, "Informe o gênero");
      existsOrError(livro.usuarioId, "Informe o(a) autor(a)");
      existsOrError(livro.conteudo, "Informe o conteúdo");
    } catch (msg) {
      res.status(400).send(msg);
    }
    if (livro.id) {
      app
        .db("livros")
        .update(livro)
        .where({ id: livro.id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("livros")
        .insert(livro)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app
        .db("livros")
        .where({ id: req.params.id })
        .del();
      try {
        existsOrError(rowsDeleted, "O livro não pode ser encontrado");
      } catch (msg) {
        return res.status(400).send(msg);
      }
      res.status(204).send();
    } catch (msg) {
      res.status(500).send(msg);
    }
  };

  const limit = 5;

  const get = async (req, res) => {
    const page = req.query.page || 1;
    const result = await app.db("livros").count("id").first();
    const count = parseInt(result.count);

    app
      .db("livros")
      .select("id", "nome", "descricao")
      .limit(limit)
      .offset(page * limit - limit)
      .then((livros) => res.json({ data: livros, count, limit }))
      .catch((err) => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db("livros")
      .where({ id: req.params.id })
      .first()
      .then((livro) => {
        livro.conteudo = livro.conteudo.toString();
        return res.json(livro);
      })
      .catch((err) => res.status(500).send(err));
  };

  const getByGenero = async (req, res) => {
    const generoId = req.params.id;
    const page = req.query.page || 1;
    const livros = await app.db.raw(queries.generosWithChildren, generoId);
    const ids = livros.rows.map((c) => c.id);

    app
      .db({ l: "livros", u: "users" })
      .select("l.id", "l.nome", "l.descricao", "l.imagemUrl", {
        author: "u.name",
      })
      .limit(limit)
      .offset(page * limit - limit)
      .whereRaw("?? = ??", ["u.id", "l.usuarioId"])
      .whereIn("generoId", ids)
      .orderBy("l.id", "desc")
      .then((livros) => res.json(livros))
      .catch((err) => res.status(500).send(err));
  };

  return { save, remove, get, getById, getByGenero };
};
