using dating_app_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace dating_app_backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Value> Values { get; set; }
    }
}