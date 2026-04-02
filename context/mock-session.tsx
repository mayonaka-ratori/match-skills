"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { MockUser, UserRole } from "@/lib/types";

const MOCK_USERS: Record<UserRole, MockUser> = {
  organizer: {
    id: "o-001",
    role: "organizer",
    name: "鈴木 健二",
    organizerId: "o-001",
  },
  musician: {
    id: "m-001",
    role: "musician",
    name: "田中 誠",
    musicianId: "m-001",
  },
  admin: {
    id: "admin-001",
    role: "admin",
    name: "管理者",
  },
};

interface MockSessionContextValue {
  user: MockUser;
  setRole: (role: UserRole) => void;
}

const MockSessionContext = createContext<MockSessionContextValue | null>(null);

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser>(MOCK_USERS.organizer);

  function setRole(role: UserRole) {
    setUser(MOCK_USERS[role]);
  }

  return (
    <MockSessionContext.Provider value={{ user, setRole }}>
      {children}
    </MockSessionContext.Provider>
  );
}

export function useMockSession(): MockSessionContextValue {
  const ctx = useContext(MockSessionContext);
  if (!ctx) throw new Error("useMockSession must be used inside MockSessionProvider");
  return ctx;
}
