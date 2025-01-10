import React, { useEffect, useState } from "react";

const CreditManagement = () => {
  const [credits, setCredits] = useState(10);
  const [lastRefreshDate, setLastRefreshDate] = useState(
    localStorage.getItem("lastRefreshDate") || new Date().toISOString()
  );

  useEffect(() => {
    const now = new Date();
    const lastRefresh = new Date(lastRefreshDate);

    if (now.getDate() !== lastRefresh.getDate()) {
      setCredits(10);
      setLastRefreshDate(now.toISOString());
      localStorage.setItem("credits", "10");
      localStorage.setItem("lastRefreshDate", now.toISOString());
    } else {
      const storedCredits = localStorage.getItem("credits");
      if (storedCredits) {
        setCredits(parseInt(storedCredits, 10));
      }
    }
  }, [lastRefreshDate]);

  const decrementCredits = () => {
    if (credits > 0) {
      const newCredits = credits - 1;
      setCredits(newCredits);
      localStorage.setItem("credits", newCredits.toString());
    }
  };

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
