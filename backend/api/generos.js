module.exports = (app) => {
  const { existsOrError, notExistsOrError } = app.api.validation;

  const save = (req, res) => {
    const genero = { ...req.body };
    if (req.params.id) genero.id = req.params.id;

    try {
      existsOrError(genero.nome, "O nome não foi informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    if (genero.id) {
      app
        .db("generos")
        .update(genero)
        .where({ id: genero.id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("generos")
        .insert(genero)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const remove = async (req, res) => {
    try {
      existsOrError(req.params.id, "O código do gênero não foi informado");

      const subgenero = await app
        .db("generos")
        .where({ relacaoId: req.params.id });

      notExistsOrError(subgenero, "O gênero possui subgêneros");

      const livros = await app.db("livros").where({ generoId: req.params.id });

      notExistsOrError(livros, "O gênero possui livros");

      const rowsDeleted = await app
        .db("generos")
        .where({ id: req.params.id })
        .del();

      existsOrError(rowsDeleted, "O gênero não pode ser encontrado");

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const withPath = (generos) => {
    const getParent = (generos, relacaoId) => {
      const parent = generos.filter((parent) => parent.id === relacaoId);
      return parent.length ? parent[0] : null;
    };

    const generosWithPath = generos.map((genero) => {
      let path = genero.nome;
      let parent = getParent(generos, genero.relacaoId);
      while (parent) {
        path = `${parent.nome} > ${path}`;
        parent = getParent(generos, parent.relacaoId);
      }
      return { ...genero, path };
    });

    generosWithPath.sort((a, b) => {
      if (a.path < b.path) return -1;
      if (a.path > b.path) return 1;
      return 0;
    });
    return generosWithPath;
  };

  const get = (req, res) => {
    app
      .db("generos")
      .then((generos) => res.json(withPath(generos)))
      .catch((err) => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db("generos")
      .where({ id: req.params.id })
      .first()
      .then((genero) => res.json(genero))
      .catch((err) => res.status(500).send(err));
  };

  const toTree = (generos, tree) => {
    if (!tree) tree = generos.filter((c) => !c.relacaoId);
    tree = tree.map((parentNode) => {
      const isChild = (node) => node.relacaoId == parentNode.id;
      parentNode.children = toTree(generos, generos.filter(isChild));
      return parentNode;
    });
    return tree;
  };

  const getTree = (req, res) => {
    app
      .db("generos")
      .then((generos) => res.json(toTree(generos)))
      .catch((err) => res.status(500).send(err));
  };

  return { save, remove, get, getById, getTree };
};
