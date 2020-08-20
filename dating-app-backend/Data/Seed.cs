using System.Collections.Generic;
using System.Linq;
using dating_app_backend.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace dating_app_backend.Data
{
    public static class Seed
    {
        public static void SeedUsers(UserManager<User> userManager)
        {
            if (!userManager.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach (var user in users)
                {
                    userManager.CreateAsync(user, "password").Wait();
                }
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            // Using is used to dispose of everything after use. Salt and hash are used as references
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }
    }
}