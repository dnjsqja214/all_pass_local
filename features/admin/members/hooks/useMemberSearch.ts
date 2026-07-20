import { useMemo, useState } from "react";
import { Member } from "../types/member";

export function useMemberSearch(initialMembers: Member[]) {
  const [searchName, setSearchName] = useState("");
  const [activeSearchName, setActiveSearchName] = useState("");

  const filteredMembers = useMemo(() => {
    const trimmed = activeSearchName.trim().toLowerCase();
    if (!trimmed) return initialMembers;
    return initialMembers.filter((member) =>
      member.name.toLowerCase().includes(trimmed)
    );
  }, [activeSearchName, initialMembers]);

  const handleSearch = (nameKeyword: string) => {
    setActiveSearchName(nameKeyword);
  };

  const handleReset = () => {
    setSearchName("");
    setActiveSearchName("");
  };

  return {
    searchName,
    setSearchName,
    filteredMembers,
    handleSearch,
    handleReset,
  };
}
