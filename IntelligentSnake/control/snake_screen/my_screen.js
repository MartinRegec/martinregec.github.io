// import Snake from "../snake/snake";
// import Point from "../point";
// import Candy from "./candy";


class MyScreen
{
    constructor(height, width, background_color, snake_body_color, snake_head_color, candies_color) {
        this.height_ = height;
        this.width_ = width;
        this.background_color = background_color;
        this.candies_color = candies_color;
        this.candies = [];
        this.snake = new Snake(Math.floor(width/2), Math.floor(height/2), snake_head_color, snake_body_color);
        this.grid = this.generate_grid();
        this.step_without_new_candy = 0;
        this.update_grid();
    }

    set height(height) {
        this.height_ = height;
    }

    set width(width) {
        this.width_ = width;
    }

    reset() {
        this.candies = [];
        this.snake = new Snake(Math.floor(this.width_/2), Math.floor(this.height_/2), this.snake.head.color,
            this.snake.body_color);
        this.update_grid();
    }

    generate_grid() {
        let grid = [];
        for (let y = 0; y < this.width_; y++)
        {
            grid[y] = [];
            for (let x = 0; x < this.height_; x++)
                grid[y][x] = new Point(x, y, this.background_color);
        }
        return grid;
    }

    clean_grid() {
        for (let y = 0; y < this.width_; y++)
        {
            for (let x = 0; x < this.height_; x++)
                this.grid[y][x].color = this.background_color;
        }
    }

    update_grid() {
        // add new candy every five steps
        this.add_candy();

        // clean current screen
        this.clean_grid();

        // draw all candies and snake to screen
        this.grid[this.snake.head.y][this.snake.head.x].color = this.snake.head.color;
        for (let i = 0; i < this.snake.body.length; i++)
            this.grid[this.snake.body[i].y][this.snake.body[i].x].color = this.snake.body[i].color;
        for (let i = 0; i < this.candies.length; i++)
            this.grid[this.candies[i].y][this.candies[i].x].color = this.candies[i].color;
    }

    move_next() {
        let returned_statement = "end"
        let next_pos = this.check_next(this.snake.get_next_dir());

        if (this.collision_with_snake(next_pos))
            return "end";
        if (this.collision_with_candy(next_pos)) {
            for (let i = 0; i < this.candies.length; i++) {
                if (Point.compare(this.candies[i], next_pos)) {
                    this.candies.splice(i ,1);
                    break;
                }
            }
            this.add_and_move_next();
            returned_statement = "candy";
        }
        else {
            this.snake.move_next(this.width_ - 1, this.height_ - 1);
            returned_statement = "moved";
        }
        this.update_grid();

        return returned_statement;
    }

    add_and_move(dir) {
        this.snake.add_and_move(dir, this.width_-1, this.height_-1);
    }

    add_and_move_next() {
        this.snake.add_and_move_next(this.width_-1, this.height_-1);
    }

    check_next(dir) {
        return this.snake.head.next(dir,this.width_-1, this.height_-1);
    }

    collision_with_snake(point) {
        if (Point.compare(this.snake.head, point))
            return true;
        for (let i = 0; i < this.snake.body.length; i++)
        {
            if (Point.compare(this.snake.body[i], point))
            {
                return true;
            }
        }
        return false;
    }

    collision_with_candy(point) {
        for (let i = 0; i < this.candies.length; i++)
        {
            if (Point.compare(this.candies[i], point))
                return true;
        }
        return false;
    }

    is_pos_free(point) {
        return (!this.collision_with_candy(point) && !this.collision_with_snake(point));
    }

    generate_candy() {
        let new_candy;
        do {
            new_candy = Candy.generate(this.width_-1, this.height_-1, this.candies_color);
        }while (!this.is_pos_free(new_candy));
        this.candies.push(new_candy);
    }

    draw(ctx, scale) {
        for (let y = 0; y < this.grid.length; y++)
        {
            for (let x = 0; x < this.grid[y].length; x++)
            {
                ctx.fillStyle = this.grid[y][x].color;
                ctx.fillRect(x*scale, y*scale, scale, scale);
            }
        }
    }

    add_candy() {
        if (this.candies.length < 5 && this.step_without_new_candy > 4)
        {
            this.generate_candy()
            this.step_without_new_candy = 0;
        }
        else
            this.step_without_new_candy++;

    }

}