"use strict";
//Esta classe cria simula o banco de dados e uma query de consulta de todos os usuários
Object.defineProperty(exports, "__esModule", { value: true });
const users = [
    { name: 'Pablo Thobias', email: 'pablo.thobias@gmail.com', id: '1' },
    { name: 'Leticia Telember', email: 'lele-gatinha-do-pablin@gmail.com', id: '2' }
];
class User {
    static findAll() {
        return Promise.resolve(users);
    }
    static findById(id) {
        return new Promise(resolve => {
            const filtered = users.filter(user => user.id === id);
            let user = undefined;
            if (filtered.length > 0) {
                user = filtered[0];
            }
            resolve(user);
        });
    }
}
exports.User = User;
