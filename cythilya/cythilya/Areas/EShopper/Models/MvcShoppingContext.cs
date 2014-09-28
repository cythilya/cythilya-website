﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace cythilya.Areas.EShopper.Models
{
    public class MvcShoppingContext: DbContext
    {
        public MvcShoppingContext()
            : base("name=DefaultConnection")
        { 
        }

        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<OrderHeader> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetailItems { get; set; }

        //Cart存Session
        //Common, Tags暫不處理

    }
}