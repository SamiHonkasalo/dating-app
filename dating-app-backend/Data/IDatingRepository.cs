using System.Collections.Generic;
using System.Threading.Tasks;
using dating_app_backend.Models;

namespace dating_app_backend.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<List<User>> GetUsers();
        Task<User> GetUser(int id);
    }
}