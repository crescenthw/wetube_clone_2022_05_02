export const trending = (req, res) => res.render("home", { pageTitle: "Home" });
export const watch = (req, res) => res.render("Watch");
export const edit = (req, res) => res.send("Edit");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const remove = (req, res) => res.send("Remove");
