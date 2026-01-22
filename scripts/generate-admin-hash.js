const bcrypt = require('bcrypt');

const password = 'Password26!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('Bcrypt hash for "Password26!":');
    console.log(hash);
    console.log('\nSQL Query to update admin user:');
    console.log(`UPDATE admin_users SET password_hash = '${hash}', updated_at = NOW() WHERE email = 'admin@gerakita.com';`);
});
