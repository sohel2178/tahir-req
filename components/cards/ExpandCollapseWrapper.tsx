"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

interface Props {
  children: React.ReactNode;
  title: string;
}

function ExpandCollapseWrapper({ title, children }: Props) {
  const [visible, setSevible] = useState(false);
  return (
    <MotionConfig transition={{ duration: 0.3, type: "spring", damping: 20 }}>
      <motion.div className="w-full" layout>
        <Card className="w-full p-2">
          <CardHeader>
            <CardTitle>
              <motion.div
                layout
                className="flex justify-between items-center min-h-10"
              >
                <span>{title}</span>
                <Button variant="outline" onClick={() => setSevible(!visible)}>
                  {visible ? (
                    <ChevronUp className="text-xl" />
                  ) : (
                    <ChevronDown className="text-xl" />
                  )}
                </Button>
              </motion.div>
            </CardTitle>
          </CardHeader>
          {visible && (
            <CardContent className="max-h-[60vh] overflow-y-auto">
              <AnimatePresence>{children}</AnimatePresence>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </MotionConfig>
  );
}

export default ExpandCollapseWrapper;
