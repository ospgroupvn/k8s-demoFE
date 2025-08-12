"use client";

import { HomepageActivity } from "@/components/dashboard/homepageActivity";
import { HomepageBarChart } from "@/components/dashboard/homepageBarChart";
import { HomepageCard } from "@/components/dashboard/homepageCard";
import { HomepagePieChart } from "@/components/dashboard/homepagePieChart";
import { FaBalanceScale, FaBuilding, FaFileAlt, FaGavel } from "react-icons/fa";

const AdminHome = () => {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <HomepageCard
          title="Công chứng viên"
          value={3365}
          icon={<FaFileAlt color="#057CCE" size={25} />}
          color="#057CCE"
        />
        <HomepageCard
          title="Luật sư"
          value={18540}
          icon={<FaBalanceScale color="#62C59A" size={25} />}
          color="#62C59A"
        />
        <HomepageCard
          title="Đấu giá viên"
          value={2193}
          icon={<FaGavel color="#F97316" size={25} />}
          color="#F97316"
        />
        <HomepageCard
          title="Tổ chức hành nghề"
          value={2235}
          icon={<FaBuilding color="#C084FC" size={25} />}
          color="#C084FC"
        />
      </div>

      <section className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <HomepageBarChart />
        </div>
        <div className="col-span-1">
          <HomepagePieChart />
        </div>
      </section>

      <section className="mt-4">
        <HomepageActivity />
      </section>
    </>
  );
};

export default AdminHome;
