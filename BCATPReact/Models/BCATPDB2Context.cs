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
                //Sqlite connection string
                //optionsBuilder.UseSqlite("DataSource=BCATPDB2.db");

                //Azure connection string
                optionsBuilder.UseSqlServer("Server=tcp:bcatpdb.database.windows.net,1433;Initial Catalog=bcatpdb2;Persist Security Info=False;User ID=jrd.consulting@hotmail.com@bcatpdb;Password=LillyTheDog01-;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

                //SqlServer connection string
                //optionsBuilder.UseSqlServer("Data Source=DESKTOP-M963UP8;Initial Catalog=bcatpdb2;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=True;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
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