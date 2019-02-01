"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validators_1 = require("../common/validators");
const environment_1 = require("../common/environment");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['M', 'F']
    },
    cpf: {
        type: String,
        required: false,
        //validador personalizado
        validate: {
            validator: validators_1.validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
});
const hasPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment_1.environment.security.saltRounds)
        .then(hash => {
        obj.password = hash;
        next();
    }).catch(next);
};
const saveMiddlewarev = function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    else {
        hasPassword(user, next);
    }
};
const updateMiddlewarev = function (next) {
    if (!this.getUpdate().password) {
        next();
    }
    else {
        hasPassword(this.getUpdate(), next);
    }
};
userSchema.pre('save', saveMiddlewarev);
userSchema.pre('update', updateMiddlewarev);
userSchema.pre('findOneAndUpdate', updateMiddlewarev);
exports.User = mongoose.model('User', userSchema);
// === MIDDLEWARE PARA DOCUMENTO E QUERY ===
//MIDDLEWARE PARA HASHEAR O PASSWORD NOS MÉTODOS HTTP QUE CONTÉM O SAVE
//nao pode ser arrow function aqui por causa do this
// userSchema.pre('save', function (next) {
//     //atribuindo o documento(this), a constante user
//     const user: User = this;
//     //se o password do documento nao foi alterado
//     if (!user.isModified('password')) {
//         next();
//     } else {
//         bcrypt.hash(user.password, environment.security.saltRounds)
//             .then(hash => {
//                 user.password = hash;
//                 next();
//             }).catch(next);
//     }
// });
// //MIDDLEWARE PARA HASHEAR O PASSWORD NOS MÉTODOS HTTP QUE CONTÉM O UPDATE
// userSchema.pre('findOneAndUpdate', function (next) {
//     //AQUI SE TRATA DE UMA QUERY E NAO DE UM DOCUMENTO
//     //se o password da query nao foi alterado
//     if (!this.getUpdate().password) {
//         next();
//     } else {
//         bcrypt.hash(this.getUpdate().password, environment.security.saltRounds)
//             .then(hash => {
//                 this.getUpdate().password = hash;
//                 next();
//             }).catch(next);
//     }
// });
