import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, User, Users } from "lucide-react";
import { motion } from "framer-motion";
import { mockFloridaCase } from "@/data/mockData";

type Person = { id: string; name: string; role: string };
type Child = typeof mockFloridaCase.children[0];

export default function PeopleManager() {
  const [people, setPeople] = useState<Person[]>([
    { id: "p1", name: mockFloridaCase.people.user, role: "Petitioner (You)" },
    { id: "p2", name: mockFloridaCase.people.otherParty, role: "Respondent" },
    { id: "p3", name: "Ms. Karen Wells", role: "Witness — Teacher" },
    { id: "p4", name: "Dr. Patricia Huang", role: "Witness — Pediatrician" },
  ]);
  const [children, setChildren] = useState(mockFloridaCase.children);

  function removePerson(id: string) {
    setPeople(people.filter((p) => p.id !== id));
  }

  function removeChild(id: string) {
    setChildren(children.filter((c) => c.id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold">People & Children</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage case participants for evidence and document generation.</p>
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            People
          </h2>
          <Button variant="outline" size="sm" className="gap-1.5" data-testid="button-add-person">
            <Plus className="h-3.5 w-3.5" />
            Add Person
          </Button>
        </div>
        <div className="space-y-2">
          {people.map((person) => (
            <Card key={person.id} data-testid={`person-card-${person.id}`}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.role}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" data-testid={`button-edit-person-${person.id}`}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  {!person.role.includes("(You)") && (
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => removePerson(person.id)} data-testid={`button-remove-person-${person.id}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Children
          </h2>
          <Button variant="outline" size="sm" className="gap-1.5" data-testid="button-add-child">
            <Plus className="h-3.5 w-3.5" />
            Add Child
          </Button>
        </div>
        <div className="space-y-3">
          {children.map((child) => (
            <Card key={child.id} data-testid={`child-card-${child.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                      {child.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{child.name}</p>
                      <p className="text-xs text-muted-foreground">Age {child.age}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" data-testid={`button-edit-child-${child.id}`}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => removeChild(child.id)} data-testid={`button-remove-child-${child.id}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">School</p>
                    <p className="text-sm">{child.school || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Birth Date</p>
                    <p className="text-sm">{child.birthDate ? new Date(child.birthDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not specified"}</p>
                  </div>
                  {child.notes && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="text-sm">{child.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
