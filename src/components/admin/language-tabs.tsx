import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LanguageTabsProps = {
  activeLanguageId: number;
  onChange: (languageId: number) => void;
};

export function LanguageTabs({ activeLanguageId, onChange }: LanguageTabsProps) {
  return (
    <Tabs
      value={String(activeLanguageId)}
      onValueChange={(value) => onChange(Number(value))}
      className="mb-4"
    >
      <TabsList>
        <TabsTrigger value="1">English</TabsTrigger>
        <TabsTrigger value="2">Deutsch</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
