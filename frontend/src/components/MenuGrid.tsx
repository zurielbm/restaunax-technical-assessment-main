import { useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MenuCategory, MenuItem } from "../../../shared/types";
import { MENU, MENU_CATEGORIES } from "../data/menu";
import { formatCurrency } from "../utils/format";

type CategoryFilter = MenuCategory | "all";

interface MenuGridProps {
  onAdd: (item: MenuItem) => void;
}

function MenuGrid({ onAdd }: MenuGridProps) {
  const [category, setCategory] = useState<CategoryFilter>("all");

  const visibleItems =
    category === "all"
      ? MENU
      : MENU.filter((item) => item.category === category);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {(["all", ...MENU_CATEGORIES] as CategoryFilter[]).map((option) => (
          <Chip
            key={option}
            label={option === "all" ? "All" : option}
            clickable
            color={category === option ? "secondary" : "default"}
            onClick={() => setCategory(option)}
            sx={{ textTransform: "capitalize" }}
          />
        ))}
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 1.5,
        }}
      >
        {visibleItems.map((item) => (
          <Card key={item.id} variant="outlined">
            <CardActionArea
              onClick={() => onAdd(item)}
              sx={{ p: 1.5, height: "100%" }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={1}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(item.price)}
                  </Typography>
                </Box>
                <AddCircleOutlineIcon fontSize="small" color="secondary" />
              </Stack>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}

export default MenuGrid;
