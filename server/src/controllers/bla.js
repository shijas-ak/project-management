if (!email || !password){
    return res.status(400).send({
      message: "Email or password missing."
    })
  }

  const {valid, reason, validators} = await isEmailValid(email);

  if (valid) return res.send({message: "OK"});

  return res.status(400).send({
    message: "Please provide a valid email address.",
    reason: validators[reason].reason
  })