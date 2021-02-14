import { LinkBox, LinkOverlay, Box, Text, Skeleton } from "@chakra-ui/react";
import { Design } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const DesignCard = ({ design }: { design?: Design }) => {
  const loaded = design !== undefined;

  return (
    <LinkBox>
      <Link href={"/designs/1"} passHref>
        <LinkOverlay
          display="flex"
          flexDirection="column"
          width="15rem"
          height="21rem"
        >
          <Skeleton
            isLoaded={loaded}
            width="15rem"
            height="18rem"
            position="relative"
            rounded="sm"
            overflow="hidden"
          >
            <Image
              src="https://source.unsplash.com/random/256x350"
              alt="Design preview"
              layout="fill"
              objectFit="cover"
            />
          </Skeleton>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            fontSize={20}
            flexGrow={1}
          >
            <Skeleton isLoaded={loaded} minWidth={0}>
              <Text
                fontWeight="bold"
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
              >
                {design?.name}
              </Text>
            </Skeleton>

            <Skeleton isLoaded={loaded}>
              <Text>
                {currencyFormatter.format((design?.price ?? 0) / 100)}
              </Text>
            </Skeleton>
          </Box>
        </LinkOverlay>
      </Link>
    </LinkBox>
  );
};

export default DesignCard;
