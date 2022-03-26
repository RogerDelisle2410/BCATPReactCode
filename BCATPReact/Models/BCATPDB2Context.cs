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
                optionsBuilder.UseSqlite("DataSource=BCATPDB2.db");

                //optionsBuilder.UseSqlServer("Server = tcp:bcatpserver.database.windows.net,1433; Initial Catalog = bcatpdb2; Persist Security Info = False; User ID = jrd.consulting@hotmail.com@bcatpserver; Password = LillyTheDog01-; MultipleActiveResultSets = False; Encrypt = True; TrustServerCertificate = False; Connection Timeout = 30;");
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