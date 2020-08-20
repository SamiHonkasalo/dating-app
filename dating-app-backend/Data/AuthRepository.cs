using System;
using System.Threading.Tasks;
using dating_app_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace dating_app_backend.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;

        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                return null;
            }

            // Signin manager handles this
            // if (!VerifyPasswordHash(password, user.PasswordHash, user.PassWordSalt))
            // {
            //     return null;
            // }
            return user;
        }

        // Verify user password
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passWordSalt)
        {
            // Check compare the given password with the computed one
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passWordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
                return true;
            }
        }

        // Creates a user with a hashed password and salt
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            // user.PasswordHash = passwordHash;
            // user.PassWordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            // Using is used to dispose of everything after use. Salt and hash are used as references
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(u => u.UserName == username))
            {
                return true;
            }
            return false;
        }
    }
}