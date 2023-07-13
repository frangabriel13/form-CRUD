const { Router } = require('express');
const { User } = require('../db');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).send(users);
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' })
  }
})

router.post('/', async (req, res) => {
  const { name, email, phone } = req.body
  try {
    const userExist = await User.findOne({ where: { email } });
    if(userExist) {
      res.status(409).json({ message: 'El email ya existe' });
    }

    let userCreate = await User.create({
      name,
      email,
      phone
    })
    res.status(201).json(userCreate);
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    const user = await User.findByPk(id);
    if(!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone !== undefined ? phone : user.phone;
    await user.save();

    res.status(200).json({ message: 'Usuario actualizado con éxito' });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = User.destroy({ where: { id: id } });
    deletedUser
      ? res.status(200).json({ message: 'Usuario eliminado con éxito' })
      : res.status(404).json({ message: 'Usuario no encontrado' });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' })
  }
})


module.exports = router;