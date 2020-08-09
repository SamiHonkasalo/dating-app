using System.Collections.Generic;
using System.Threading.Tasks;
using dating_app_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace dating_app_backend.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public Task<User> GetUser(int id)
        {
            var user = _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public Task<List<User>> GetUsers()
        {
            var users = _context.Users.Include(p => p.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}