import { Router } from 'express'
import { User } from '../models'

import valid from '../util/validateEmail'

const router = new Router()

router.post('/signup', (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    res.status(422).send({ message: 'You must provide an email and password.' })
  }

  if (!valid(email)) {
    res.status(422).send({ message: 'You must provide a valid email address.' })
  }

  const signup = existingUser => {
    if (existingUser) {
      res.status(422).send({ message: 'Email is already in use.' })
    }

    const newUser = new User({
      email,
      password,
    })

    newUser.save()
      .then(
        createdUser => res.status(200).json({
          email: createdUser.email,
          success: true,
        }),
        err => next(err)
      )
  }

  User.findOne({ email })
    .then(
      existingUser => signup(existingUser),
      err => next(err)
    )
})

export default router
