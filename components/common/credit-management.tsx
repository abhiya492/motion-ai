import React, { useEffect, useState } from "react";
import { getUserDailyCredits } from "@/lib/user-helpers";
import { currentUser } from "@clerk/nextjs/server";
import getDbConnection from "@/lib/db";

const CreditManagement = () => {
  const [credits, setCredits] = useState(10);

  useEffect(() => {
    const fetchCredits = async () => {
      const user = await currentUser();
      if (user) {
        const sql = await getDbConnection();
        const dailyCredits = await getUserDailyCredits(sql, user.id);
        setCredits(dailyCredits);
      }
    };

    fetchCredits();
  }, []);

  return (
    <div className="credit-management">
      {credits > 0 ? (
        <p>
          You have{" "}
          <span className="font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
            {credits}
          </span>{" "}
          daily credits remaining.
        </p>
      ) : (
        <p>
          You have exhausted your 10 daily credits. Please upgrade your plan to
          continue uploading.
        </p>
      )}
    </div>
  );
};

export default CreditManagement;
