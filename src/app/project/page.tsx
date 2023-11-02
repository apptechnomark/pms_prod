/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import {
  AvatarGroup,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  CircularProgressProps,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";

function page() {
  const [age, setAge] = React.useState("");
  const [progress, setProgress] = React.useState(25);

  const [getOrgDetailsFunction, setGetOrgDetailsFunction] = useState<
    (() => void) | null
  >(null);
  const handleChange = (event: SelectChangeEvent) => {};
  const handleUserDetailsFetch = (getData: () => void) => {
    setGetOrgDetailsFunction(() => getData);
  };
  const handleModuleNames = () => {};

  const CircularProgressWithLabel = (
    props: CircularProgressProps & { value: number }
  ) => {
    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <span className="relative">
          <CircularProgress
            variant="determinate"
            value={100}
            size={45}
            thickness={2}
            sx={{
              color: (theme) =>
                theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
            }}
          />
          <CircularProgress
            size={45}
            thickness={2}
            className="absolute top-0 left-0"
            variant="determinate"
            {...props}
          />
        </span>
        <Box
          sx={{
            top: "12px",
            left: "3px",
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            className="text-[12px]"
            variant="caption"
            component="div"
            color="text.primary"
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Wrapper>
      <Navbar
        onUserDetailsFetch={handleUserDetailsFetch}
        onHandleModuleNames={handleModuleNames}
      />
      <div className="px-[20px] py-4">
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            m: 0,
            width: "100%",
            pb: "20px",
          }}
        >
          <Grid item xs={8} className="!pt-0">
            Project
          </Grid>
          <Grid item xs={4} className="!pt-0 flex justify-end items-center">
            <Select
              sx={{ width: "50%" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
              className="selectDropheight"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <Button variant="outlined" className="ml-3">
              Create Task
            </Button>
          </Grid>
        </Grid>

        <div className="flex gap-5 flex-wrap">
          <Card
            className="group relative hover:border-primary hover:cursor-pointer"
            sx={{
              width: "100%",
              maxWidth: "32%",
              border: "1px solid #ccc",
              boxShadow: "none",
            }}
          >
            <CardHeader
              className="text-sm"
              sx={{ borderBottom: "1px solid #ccc" }}
              avatar={<CircularProgressWithLabel value={progress} />}
              title={<span className="font-bold">ATN Constructions</span>}
              subheader="GodFrey"
              action={
                <span className="text-xs pl-2">
                  <Badge color="success" variant="dot" className="mr-3"></Badge>
                  In Progress
                </span>
              }
            />
            <CardContent sx={{ p: 0 }}>
              <Grid container sx={{ borderBottom: "1px solid #ccc", mt: "0" }}>
                <Grid
                  className="text-center"
                  item
                  xs={4}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography className="text-sm" variant="subtitle1">
                    Tasks
                  </Typography>
                  <Typography className="font-bold" variant="button">
                    24
                  </Typography>
                </Grid>
                <Grid
                  className="text-center"
                  item
                  xs={4}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    items: "center",
                    justify: "center",
                    borderLeft: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  <Typography className="text-sm" variant="subtitle1">
                    Sub-tasks
                  </Typography>
                  <Typography className="font-bold" variant="button">
                    63
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  className="!pt-0 items-center justify-center"
                  sx={{
                    p: 0,
                    display: "flex",
                  }}
                >
                  <AvatarGroup
                    max={4}
                    sx={{
                      p: 2,
                      "& .MuiAvatar-root": {
                        width: 25,
                        height: 25,
                        fontSize: 14,
                      },
                    }}
                  >
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Trevor Henderson"
                      src="/static/images/avatar/5.jpg"
                    />
                  </AvatarGroup>
                </Grid>
              </Grid>
            </CardContent>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Start Date</span>
                    <span className="font-bold text-sm pl-2">15/02/2023</span>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">End Date</span>
                    <span className="font-bold text-sm pl-2">15/02/2023</span>
                  </div>
                </Grid>
              </Grid>
            </CardContent>

            <div className="p-[16px] bg-gray-200 w-full absolute -bottom-20 group-hover:bottom-0 transition-all duration-1000">
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Current Period:</span>
                    <span className="font-bold text-sm pl-2">March</span>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Close Month:</span>
                    <span className="font-bold text-sm pl-2">February</span>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Card>
          <Card
            className="group relative hover:border-primary hover:cursor-pointer"
            sx={{
              width: "100%",
              maxWidth: "32%",
              border: "1px solid #ccc",
              boxShadow: "none",
            }}
          >
            <CardHeader
              className="text-sm"
              sx={{ borderBottom: "1px solid #ccc" }}
              avatar={<CircularProgressWithLabel value={progress} />}
              title={<span className="font-bold">ATN Constructions</span>}
              subheader="GodFrey"
              action={
                <span className="text-xs pl-2">
                  <Badge color="success" variant="dot" className="mr-3"></Badge>
                  In Progress
                </span>
              }
            />
            <CardContent sx={{ p: 0 }}>
              <Grid container sx={{ borderBottom: "1px solid #ccc", mt: "0" }}>
                <Grid
                  className="text-center"
                  item
                  xs={4}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography className="text-sm" variant="subtitle1">
                    Tasks
                  </Typography>
                  <Typography className="font-bold" variant="button">
                    24
                  </Typography>
                </Grid>
                <Grid
                  className="text-center"
                  item
                  xs={4}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    items: "center",
                    justify: "center",
                    borderLeft: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  <Typography className="text-sm" variant="subtitle1">
                    Sub-tasks
                  </Typography>
                  <Typography className="font-bold" variant="button">
                    63
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  className="!pt-0 items-center justify-center"
                  sx={{
                    p: 0,
                    display: "flex",
                  }}
                >
                  <AvatarGroup
                    max={4}
                    sx={{
                      p: 2,
                      "& .MuiAvatar-root": {
                        width: 25,
                        height: 25,
                        fontSize: 14,
                      },
                    }}
                  >
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Trevor Henderson"
                      src="/static/images/avatar/5.jpg"
                    />
                  </AvatarGroup>
                </Grid>
              </Grid>
            </CardContent>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Start Date</span>
                    <span className="font-bold text-sm pl-2">15/02/2023</span>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">End Date</span>
                    <span className="font-bold text-sm pl-2">15/02/2023</span>
                  </div>
                </Grid>
              </Grid>
            </CardContent>

            <div className="p-[16px] bg-gray-200 w-full absolute -bottom-20 group-hover:bottom-0 transition-all duration-1000">
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Current Period:</span>
                    <span className="font-bold text-sm pl-2">March</span>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Close Month:</span>
                    <span className="font-bold text-sm pl-2">February</span>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Card>
          <Card
            className="group relative hover:border-primary hover:cursor-pointer"
            sx={{
              width: "100%",
              maxWidth: "32%",
              border: "1px solid #ccc",
              boxShadow: "none",
            }}
          >
            <CardHeader
              className="text-sm"
              sx={{ borderBottom: "1px solid #ccc" }}
              avatar={<CircularProgressWithLabel value={progress} />}
              title={<span className="font-bold">ATN Constructions</span>}
              subheader="GodFrey"
              action={
                <span className="text-xs pl-2">
                  <Badge color="success" variant="dot" className="mr-3"></Badge>
                  In Progress
                </span>
              }
            />
            <CardContent sx={{ p: 0 }}>
              <Grid container sx={{ borderBottom: "1px solid #ccc", mt: "0" }}>
                <Grid
                  className="text-center"
                  item
                  xs={4}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography className="text-sm" variant="subtitle1">
                    Tasks
                  </Typography>
                  <Typography className="font-bold" variant="button">
                    24
                  </Typography>
                </Grid>
                <Grid
                  className="text-center"
                  item
                  xs={4}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    items: "center",
                    justify: "center",
                    borderLeft: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  <Typography className="text-sm" variant="subtitle1">
                    Sub-tasks
                  </Typography>
                  <Typography className="font-bold" variant="button">
                    63
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  className="!pt-0 items-center justify-center"
                  sx={{
                    p: 0,
                    display: "flex",
                  }}
                >
                  <AvatarGroup
                    max={4}
                    sx={{
                      p: 2,
                      "& .MuiAvatar-root": {
                        width: 25,
                        height: 25,
                        fontSize: 14,
                      },
                    }}
                  >
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Trevor Henderson"
                      src="/static/images/avatar/5.jpg"
                    />
                  </AvatarGroup>
                </Grid>
              </Grid>
            </CardContent>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Start Date</span>
                    <span className="font-bold text-sm pl-2">15/02/2023</span>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">End Date</span>
                    <span className="font-bold text-sm pl-2">15/02/2023</span>
                  </div>
                </Grid>
              </Grid>
            </CardContent>

            <div className="p-[16px] bg-gray-200 w-full absolute -bottom-20 group-hover:bottom-0 transition-all duration-1000">
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Current Period:</span>
                    <span className="font-bold text-sm pl-2">March</span>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Close Month:</span>
                    <span className="font-bold text-sm pl-2">February</span>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Card>
          <Card
            className="group relative hover:border-primary hover:cursor-pointer"
            sx={{
              width: "100%",
              maxWidth: "32%",
              border: "1px solid #ccc",
              boxShadow: "none",
            }}
          >
            <CardHeader
              className="text-sm"
              sx={{ borderBottom: "1px solid #ccc" }}
              avatar={<CircularProgressWithLabel value={progress} />}
              title={<span className="font-bold">ATN Constructions</span>}
              subheader="GodFrey"
              action={
                <span className="text-xs pl-2">
                  <Badge color="success" variant="dot" className="mr-3"></Badge>
                  In Progress
                </span>
              }
            />
            <CardContent sx={{ p: 0 }}>
              <Grid container sx={{ borderBottom: "1px solid #ccc", mt: "0" }}>
                <Grid
                  className="text-center"
                  item
                  xs={4}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography className="text-sm" variant="subtitle1">
                    Tasks
                  </Typography>
                  <Typography className="font-bold" variant="button">
                    24
                  </Typography>
                </Grid>
                <Grid
                  className="text-center"
                  item
                  xs={4}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    items: "center",
                    justify: "center",
                    borderLeft: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  <Typography className="text-sm" variant="subtitle1">
                    Sub-tasks
                  </Typography>
                  <Typography className="font-bold" variant="button">
                    63
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  className="!pt-0 items-center justify-center"
                  sx={{
                    p: 0,
                    display: "flex",
                  }}
                >
                  <AvatarGroup
                    max={4}
                    sx={{
                      p: 2,
                      "& .MuiAvatar-root": {
                        width: 25,
                        height: 25,
                        fontSize: 14,
                      },
                    }}
                  >
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      sx={{ width: "30px", height: "30px", fontSize: "14px" }}
                      alt="Trevor Henderson"
                      src="/static/images/avatar/5.jpg"
                    />
                  </AvatarGroup>
                </Grid>
              </Grid>
            </CardContent>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Start Date</span>
                    <span className="font-bold text-sm pl-2">15/02/2023</span>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">End Date</span>
                    <span className="font-bold text-sm pl-2">15/02/2023</span>
                  </div>
                </Grid>
              </Grid>
            </CardContent>

            <div className="p-[16px] bg-gray-200 w-full absolute -bottom-20 group-hover:bottom-0 transition-all duration-1000">
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Current Period:</span>
                    <span className="font-bold text-sm pl-2">March</span>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="flex">
                    <span className="text-sm">Close Month:</span>
                    <span className="font-bold text-sm pl-2">February</span>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}
export default page;
