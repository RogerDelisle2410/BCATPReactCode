using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace BCATPReact.Models
{
    public partial class BCATPDB2Context : DbContext
    {
        public IConfiguration Configuration { get; }
        public string connectionString;

        public BCATPDB2Context()
        {
        }

        public BCATPDB2Context(DbContextOptions<BCATPDB2Context> options)
            : base(options)
        {
        }
        public virtual DbSet<AllData> AllData { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AllData>().ToTable("alldata");
            OnModelCreatingPartial(modelBuilder);
        }
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
