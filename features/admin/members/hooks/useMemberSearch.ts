import { useState, useEffect } from "react";
import { Member } from "../types/member";

export function useMemberSearch(initialMembers: Member[]) {
  const [searchName, setSearchName] = useState("");
  const [activeSearchName, setActiveSearchName] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(initialMembers);

  useEffect(() => {
    const trimmed = activeSearchName.trim().toLowerCase();
    if (!trimmed) {
      setFilteredMembers(initialMembers);
      return;
    }
    const filtered = initialMembers.filter((member) =>
      member.name.toLowerCase().includes(trimmed)
    );
    setFilteredMembers(filtered);
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
