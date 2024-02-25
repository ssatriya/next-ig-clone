"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilterOptions from "./filter-options";
import AdjustmentOptions from "./adjustment-options";

const FilterTabs = () => {
  return (
    <Tabs defaultValue="filters" className="w-full p-0">
      <TabsList className="w-full bg-transparent rounded-none border-b-[1px] border-igLink/20 px-0">
        <TabsTrigger
          value="filters"
          className="w-full text-igLink/40 rounded-none border-b-[1px] border-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-[1px] data-[state=active]:border-igLink h-[42px] font-semibold data-[state=active]:text-igLink"
        >
          Filters
        </TabsTrigger>
        <TabsTrigger
          value="adjustments"
          className="w-full text-igLink/40 rounded-none border-b-[1px] border-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-[1px] data-[state=active]:border-igLink h-[42px] font-semibold data-[state=active]:text-igLink"
        >
          Adjustments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="filters" className="p-4 m-0">
        <FilterOptions />
      </TabsContent>
      <TabsContent value="adjustments" className="p-4 m-0">
        <AdjustmentOptions />
      </TabsContent>
    </Tabs>
  );
};
export default FilterTabs;
